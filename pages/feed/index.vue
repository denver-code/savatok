<template>
    <div class="m-0 p-0 w-full h-full">
      <div class="space-y-4">
        <div v-if="$device.isDesktop">
          Please use a mobile device to view this page.
        </div>
        <div
          v-else-if="$device.isMobile"
          class="flex flex-col overflow-y-scroll h-screen snap-y snap-mandatory"
        >
          <div
            v-for="(video, index) in uploads"
            :key="index"
            class="flex-none w-full h-screen snap-start relative"
          >
            <div class="w-full h-full flex items-center justify-center">
              <video
                ref="videos"
                :src="getFileUrl(video)"
                loop
                playsinline
                controls
                class="object-cover w-full h-full"
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useObjectUrl, useDropZone, useFileDialog } from "@vueuse/core";
  import { ref, onMounted } from "vue";
  
  const dropZoneRef = ref();
  
  const toast = useToast();
  
  const { user } = usePocketBaseUser();
  const pb = usePocketBaseClient();
  
  definePageMeta({
    middleware: ["auth"],
  });
  
  const { data: uploads, refresh, pending } = await useAsyncData(
    "uploads",
    async () => {
      const records = await pb
        .collection("uploads")
        .getFullList({ sort: "-created" });
      return records;
    },
    {
      server: false,
    }
  );
  
  function getFileUrl(post) {
    return pb.files.getUrl(post, post.video);
  }
  
  // Intersection Observer setup
  onMounted(() => {
    const options = {
      root: null, // viewport as root
      rootMargin: "0px",
      threshold: 0.5, // trigger when half of the video is visible
    };
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target.querySelector("video");
            if (video) {
              video.play().catch((err) => {
                // Handle autoplay error (e.g., user gesture required)
              });
            }
          } else {
            const video = entry.target.querySelector("video");
            if (video) {
              video.pause();
            }
          }
        });
      },
      options
    );
  
    const videoElements = document.querySelectorAll(".snap-start");
    videoElements.forEach((el) => {
      observer.observe(el);
    });
  });
  </script>
  
  <style></style>
  