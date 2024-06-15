<template>
  <div>
    <div v-if="user" class="space-y-4">
      <Navbar :user="user" />
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h4 class="font-semibold">Videos </h4>
          <UButton @click="refresh" icon="i-heroicons-arrow-path-solid" variant="ghost" size="xs" color="gray"
            :loading="pending" />
        </div>
        <UButton @click="newPost = true" label="Create Post" color="black" />
      </div>
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          <div v-for="post in uploads" :key="post.id" class="flex justify-center">
            <div v-if="post.video" class="flex flex-col items-center w-full max-w-md">
              <video class="w-full h-auto max-h-[75vh] object-cover rounded-lg" :src="getFileUrl(post)"
                controls loop></video>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UModal v-model="newPost">
      <div class="p-4 space-y-4">
        <p>Add New Video</p>
        <div>
          <p class="text-sm">Post Preview Image</p>
          <div ref="dropZoneRef"
            class="rounded-lg h-40 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center mt-2 transition-all overflow-hidden"
            :class="{
              'animate-pulse ring-4 ring-teal-500 bg-teal-50 border-teal-500 dark:border-teal-400 ring-opacity-20':
                isOverDropZone,
            }" @click="open">
            <div v-if="!post.video" class="text-center cursor-pointer">
              <p>Drag some files here</p>
              <p class="text-xs mt-1 text-gray-500">or click here to upload</p>
            </div>
            <img v-else :src="imagePreview" class="h-40 w-auto object-cover" />
          </div>
        </div>
        <UButton @click="savePost" size="lg" label="Save" color="black" block />
      </div>
    </UModal>

  </div>
</template>

<script setup>
import { useObjectUrl, useDropZone, useFileDialog } from "@vueuse/core";

const dropZoneRef = ref();

const toast = useToast();

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);
const { user } = usePocketBaseUser();
const pb = usePocketBaseClient();

definePageMeta({
  middleware: ["auth"],
});

const post = ref({
  video: undefined,
});


const upload = ref({
  media_file: undefined,
})

const newPost = ref(false);
const file = ref();
const imagePreview = useObjectUrl(file);

function onDrop(files) {
  post.value.video = files[0];
  file.value = files && files.length > 0 ? files[0] : undefined;
}

const { open, onChange } = useFileDialog({
  accept: "video/*",
});

onChange((files) => {
  post.value.video = files[0];
  file.value = files && files.length > 0 ? files[0] : undefined;
});

async function savePost() {
  try {
    post.value.owner = user.value.id;
    const record = await pb.collection("uploads").create(post.value);
    console.log(record);
    toast.add({
      title: "Post created successfully",
    });
    post.value = {
      video: undefined,
    };
    newPost.value = false;
  } catch (error) {
    console.log(error);
  }
}

const {
  data: uploads,
  refresh,
  pending,
} = await useAsyncData(
  "uploads",
  async () => {
    const records = await pb.collection("uploads").getFullList({
      sort: "-created",
    });
    return records;
  },
  {
    server: false,
  }
);

onMounted(() => {
  pb.collection("uploads").subscribe("*", function (e) {
    if (e.action === "create") {
      console.log("new post created");
      uploads.value = [e.record, ...uploads.value];
    }
    if (e.action === "delete") {
      console.log("post deleted");
      uploads.value = uploads.value.filter((post) => post.id !== e.record.id);
    }
    if (e.action === "update") {
      console.log("post updated");
      uploads.value = uploads.value.map((post) => {
        if (post.id === e.record.id) {
          return e.record;
        }
        return post;
      });
    }
  });
});

function getFileUrl(post) {
  return pb.files.getUrl(post, post.video);
}
</script>

<style></style>