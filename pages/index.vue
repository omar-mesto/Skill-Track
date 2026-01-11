<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const showAccountModal = ref(false)

const accounts = [
  {
    key: 'student',
    title: 'Student',
    desc: 'Learn, build skills, and join challenges.',
    route: '/auth/student',
    icon: 'i-heroicons-academic-cap',
  },
  {
    key: 'professor',
    title: 'Professor',
    desc: 'Guide students and share expertise.',
    route: '/auth/professor',
    icon: 'i-heroicons-user-group',
  },
  {
    key: 'company',
    title: 'Company',
    desc: 'Post opportunities and discover talent.',
    route: '/auth/company',
    icon: 'i-heroicons-building-office-2',
  },
  {
    key: 'admin',
    title: 'Admin',
    desc: 'Manage platform and users.',
    route: '/auth/admin',
    icon: 'i-heroicons-shield-check',
  },
]

const goToAuth = (path: string) => {
  showAccountModal.value = false
  router.push(path)
}

const features = [
  {
    title: 'Achievements Tracker',
    desc: 'Keep your learning progress organized and measurable.',
    icon: 'i-heroicons-trophy',
  },
  {
    title: 'Skill Badges & Points',
    desc: 'Earn badges as you complete tasks and milestones.',
    icon: 'i-heroicons-check-badge',
  },
  {
    title: 'Opportunities & Challenges',
    desc: 'Discover real projects, internships, and community challenges.',
    icon: 'i-heroicons-briefcase',
  },
  {
    title: 'AI Hints',
    desc: 'Get smart suggestions and guidance when you get stuck.',
    icon: 'i-heroicons-sparkles',
  },
]

const steps = [
  { title: 'Create your profile', desc: 'Tell us what you’re learning and what you want to achieve.', icon: 'i-heroicons-user' },
  { title: 'Join challenges', desc: 'Pick opportunities that match your skills and goals.', icon: 'i-heroicons-flag' },
  { title: 'Build your portfolio', desc: 'Collect work, feedback, and proof of progress.', icon: 'i-heroicons-folder' },
  { title: 'Connect & grow', desc: 'Learn with peers, mentors, and companies.', icon: 'i-heroicons-users' },
]

const opportunities = [
  {
    title: 'UI/UX Design Challenge',
    badge: 'Design',
    desc: 'Create a modern dashboard and share your process.',
  },
  {
    title: 'Frontend Mini Project',
    badge: 'Web',
    desc: 'Build a responsive landing page with Nuxt.',
  },
  {
    title: 'Data Visualization Task',
    badge: 'Data',
    desc: 'Turn a dataset into clear charts and insights.',
  },
  {
    title: 'Community Collaboration',
    badge: 'Teamwork',
    desc: 'Pair up and ship something small in 48 hours.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-app">
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-9 w-9 rounded-xl bg-primary grid place-items-center text-white font-bold">
            S
          </div>
          <span class="font-extrabold text-slate-900">SkillTrack</span>
        </div>

        <nav class="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <a
            class="hover:text-slate-900"
            href="#features"
          >Features</a>
          <a
            class="hover:text-slate-900"
            href="#how"
          >How it works</a>
          <a
            class="hover:text-slate-900"
            href="#community"
          >Community</a>
          <a
            class="hover:text-slate-900"
            href="#opportunities"
          >Opportunities</a>
        </nav>

        <div class="flex items-center gap-2">
          <UButton
            color="primary"
            class="rounded-full px-5 text-white"
            @click="showAccountModal = true"
          >
            Get Started
          </UButton>
          <UButton
            variant="ghost"
            class="rounded-full hidden sm:inline-flex"
            @click="showAccountModal = true"
          >
            Sign in
          </UButton>
        </div>
      </div>
    </header>

    <main>
      <section class="relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="hero-grad absolute -top-24 -left-24 h-72 w-72 rounded-full" />
          <div class="hero-grad2 absolute top-10 -right-24 h-80 w-80 rounded-full" />
        </div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative">
          <div class="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
                More than grades.
                <span class="block text-primary">Show your real skills.</span>
              </h1>

              <p class="mt-4 text-slate-600 text-lg leading-relaxed max-w-xl">
                SkillTrack helps students build a verified portfolio, join challenges, and connect with mentors and companies —
                all in one place.
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                <UButton
                  color="primary"
                  class="rounded-full px-6 h-12 text-white"
                  @click="showAccountModal = true"
                >
                  Create an account
                </UButton>
                <UButton
                  variant="outline"
                  class="rounded-full px-6 h-12 border-slate-200 text-slate-900"
                  @click="showAccountModal = true"
                >
                  Explore the community
                </UButton>
              </div>

              <div class="mt-8 flex items-center gap-4 text-sm text-slate-600">
                <div class="flex -space-x-2">
                  <UAvatar
                    size="sm"
                    src="/StudentLogin.png"
                  />
                  <UAvatar
                    size="sm"
                    src="/StudentLogin.png"
                  />
                  <UAvatar
                    size="sm"
                    src="/StudentLogin.png"
                  />
                </div>
                <span>Join learners building and sharing every day.</span>
              </div>
            </div>

            <div class="relative">
              <div class="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-slate-100" />
                    <div>
                      <div class="h-3 w-32 bg-slate-100 rounded" />
                      <div class="h-3 w-20 bg-slate-100 rounded mt-2" />
                    </div>
                  </div>
                  <div class="h-8 w-20 rounded-full bg-slate-100" />
                </div>

                <div class="mt-5 grid grid-cols-3 gap-3">
                  <div class="h-16 rounded-2xl bg-slate-50 border border-slate-100" />
                  <div class="h-16 rounded-2xl bg-slate-50 border border-slate-100" />
                  <div class="h-16 rounded-2xl bg-slate-50 border border-slate-100" />
                </div>

                <div class="mt-5 h-56 rounded-2xl bg-app border border-slate-100 relative overflow-hidden">
                  <div class="absolute left-6 top-6 h-10 w-40 rounded-xl bg-white border border-slate-100 shadow-sm" />
                  <div class="absolute left-6 top-20 right-6 h-10 rounded-xl bg-white border border-slate-100 shadow-sm" />
                  <div class="absolute left-6 top-34 right-16 h-10 rounded-xl bg-white border border-slate-100 shadow-sm" />
                  <div class="absolute right-6 top-20 h-28 w-28 rounded-2xl bg-primary/10 border border-primary/10" />
                </div>

                <div class="mt-5 flex items-center justify-between">
                  <div class="flex gap-2">
                    <div class="h-9 w-9 rounded-full bg-slate-100" />
                    <div class="h-9 w-9 rounded-full bg-slate-100" />
                    <div class="h-9 w-9 rounded-full bg-slate-100" />
                  </div>
                  <div class="h-10 w-28 rounded-full bg-primary/10 border border-primary/10" />
                </div>
              </div>

              <div class="absolute -bottom-6 -left-6 hidden lg:block">
                <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 w-64">
                  <div class="flex items-center gap-2">
                    <div class="h-9 w-9 rounded-xl bg-primary text-white grid place-items-center">
                      <UIcon
                        name="i-heroicons-sparkles"
                        class="w-5 h-5"
                      />
                    </div>
                    <div class="font-semibold text-slate-900">
                      AI Hints
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-slate-600">
                    Get helpful guidance without giving away the full solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
            SkillTrack Platform Features
          </h2>
          <p class="mt-2 text-slate-600">
            Everything you need to learn, build, and prove your skills.
          </p>
        </div>

        <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard
            v-for="f in features"
            :key="f.title"
            class="rounded-2xl border-slate-200"
          >
            <div class="h-10 w-10 rounded-xl bg-primary/10 border border-primary/10 grid place-items-center">
              <UIcon
                :name="f.icon"
                class="w-5 h-5 text-primary"
              />
            </div>
            <h3 class="mt-4 font-bold text-slate-900">
              {{ f.title }}
            </h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              {{ f.desc }}
            </p>
          </UCard>
        </div>
      </section>

      <section
        id="how"
        class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How SkillTrack Works for Students
          </h2>
          <p class="mt-2 text-slate-600">
            Start small, stay consistent, and watch your portfolio grow.
          </p>
        </div>

        <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard
            v-for="(s, idx) in steps"
            :key="s.title"
            class="rounded-2xl border-slate-200"
          >
            <div class="flex items-center justify-between">
              <div class="h-10 w-10 rounded-xl bg-secondary/30 border border-secondary/40 grid place-items-center">
                <UIcon
                  :name="s.icon"
                  class="w-5 h-5 text-primary"
                />
              </div>
              <div class="text-xs font-semibold text-slate-500">
                Step {{ idx + 1 }}
              </div>
            </div>
            <h3 class="mt-4 font-bold text-slate-900">
              {{ s.title }}
            </h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">
              {{ s.desc }}
            </p>
          </UCard>
        </div>
      </section>

      <section
        id="community"
        class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <div class="community-wrap rounded-3xl overflow-hidden border border-slate-200">
          <div class="grid lg:grid-cols-2 gap-0">
            <div class="p-8 sm:p-10 bg-white grid align-content-center">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Community & Engagement
              </h2>
              <p class="mt-3 text-slate-600 leading-relaxed">
                Share knowledge, ask questions, and tackle challenges together. React, comment, and collaborate with students,
                professors, and companies.
              </p>

              <div class="mt-8 grid grid-cols-2 gap-3">
                <UCard
                  class="rounded-2xl border-slate-200"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-chat-bubble-left-right"
                      class="w-5 h-5 text-primary"
                    />
                    <span class="font-semibold text-slate-900">Ask & Answer</span>
                  </div>
                  <p class="mt-2 text-sm text-slate-600">
                    Get help, give help, grow faster.
                  </p>
                </UCard>
                <UCard
                  class="rounded-2xl border-slate-200"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-heart"
                      class="w-5 h-5 text-primary"
                    />
                    <span class="font-semibold text-slate-900">Reactions</span>
                  </div>
                  <p class="mt-2 text-sm text-slate-600">
                    Support creators with quick feedback.
                  </p>
                </UCard>
              </div>
            </div>

            <div class="p-8 sm:p-10 bg-primary relative">
              <div class="absolute inset-0 opacity-30">
                <div class="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/20" />
                <div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10" />
              </div>

              <div class="relative">
                <div class="text-white/90 text-sm font-semibold">
                  Community preview
                </div>
                <div class="mt-4 rounded-2xl bg-white border border-white/20 shadow-sm overflow-hidden">
                  <div class="h-10 bg-slate-100 flex items-center gap-2 px-4">
                    <div class="h-3 w-3 rounded-full bg-slate-300" />
                    <div class="h-3 w-3 rounded-full bg-slate-300" />
                    <div class="h-3 w-3 rounded-full bg-slate-300" />
                    <div class="ml-auto h-3 w-24 bg-slate-200 rounded" />
                  </div>

                  <div class="p-5">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-slate-200" />
                        <div>
                          <div class="h-3 w-28 bg-slate-200 rounded" />
                          <div class="h-3 w-20 bg-slate-100 rounded mt-2" />
                        </div>
                      </div>
                      <div class="h-8 w-20 bg-slate-100 rounded-full" />
                    </div>

                    <div class="mt-4 h-36 rounded-2xl bg-slate-50 border border-slate-100" />

                    <div class="mt-4 flex items-center gap-3">
                      <div class="h-9 w-24 rounded-full bg-slate-100" />
                      <div class="h-9 w-28 rounded-full bg-slate-100" />
                      <div class="h-9 w-24 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div class="mt-6 text-white">
                  <h3 class="text-xl font-extrabold">
                    Share insights, ask questions,
                    <span class="block">and overcome challenges.</span>
                  </h3>
                  <p class="mt-2 text-white/80 text-sm leading-relaxed max-w-md">
                    Build a strong network with meaningful discussions and practical collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="opportunities"
        class="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Latest Opportunities & Challenges
          </h2>
          <p class="mt-2 text-slate-600">
            Pick one today and move forward with confidence.
          </p>
        </div>

        <div class="mt-8 grid lg:grid-cols-2 gap-4">
          <UCard
            v-for="o in opportunities"
            :key="o.title"
            class="rounded-2xl border-slate-200"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <UBadge
                    class="rounded-full bg-secondary/30 text-primary border border-secondary/40"
                    variant="soft"
                  >
                    {{ o.badge }}
                  </UBadge>
                </div>
                <h3 class="mt-3 font-extrabold text-slate-900 text-lg">
                  {{ o.title }}
                </h3>
                <p class="mt-2 text-sm text-slate-600 leading-relaxed">
                  {{ o.desc }}
                </p>
              </div>
              <div class="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/10 grid place-items-center">
                <UIcon
                  name="i-heroicons-arrow-trending-up"
                  class="w-6 h-6 text-primary"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center justify-between">
              <div class="text-xs text-slate-500">
                Updated recently
              </div>
            </div>
          </UCard>
        </div>
      </section>

      <footer class="mt-8">
        <div class="bg-primary text-white">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div class="grid md:grid-cols-4 gap-8">
              <div class="md:col-span-2">
                <div class="flex items-center gap-2">
                  <div class="h-10 w-10 rounded-xl bg-white/15 grid place-items-center font-bold">
                    S
                  </div>
                  <span class="font-extrabold text-xl">SkillTrack</span>
                </div>
                <p class="mt-3 text-white/80 max-w-md">
                  A modern platform that helps students prove skills through projects, community feedback, and opportunities.
                </p>
                <div class="mt-5 flex gap-3">
                  <UButton class="rounded-full bg-white text-primary hover:bg-white/90">
                    Get Started
                  </UButton>
                </div>
              </div>

              <div>
                <div class="font-bold">
                  Platform
                </div>
                <ul class="mt-3 space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      class="hover:text-white"
                      href="#features"
                    >Features</a>
                  </li>
                  <li>
                    <a
                      class="hover:text-white"
                      href="#how"
                    >How it works</a>
                  </li>
                  <li>
                    <a
                      class="hover:text-white"
                      href="#community"
                    >Community</a>
                  </li>
                  <li>
                    <a
                      class="hover:text-white"
                      href="#opportunities"
                    >Opportunities</a>
                  </li>
                </ul>
              </div>

              <div>
                <div class="font-bold">
                  Support
                </div>
                <ul class="mt-3 space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      class="hover:text-white"
                      href="#"
                    >Help Center</a>
                  </li>
                  <li>
                    <a
                      class="hover:text-white"
                      href="#"
                    >Privacy</a>
                  </li>
                  <li>
                    <a
                      class="hover:text-white"
                      href="#"
                    >Terms</a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-10 pt-6 border-t border-white/15 text-white/70 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>© {{ new Date().getFullYear() }} SkillTrack. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
    <UModal
      v-model:open="showAccountModal"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      class="bg-background test-black sm:min-w-2xl w-full"
    >
      <template #title>
        <div class="text-xl font-extrabold text-slate-900">
          Choose Account Type
        </div>
      </template>

      <template #body>
        <div class="grid sm:grid-cols-2 gap-4">
          <UCard
            v-for="acc in accounts"
            :key="acc.key"
            class="cursor-pointer rounded-2xl bg-white border-slate-200 hover:shadow-md transition"
            @click="goToAuth(acc.route)"
          >
            <div class="flex items-start  gap-4">
              <div class="h-20 shadow-2xl w-24 rounded-xl bg-primary/10 border border-primary/10 grid place-items-center">
                <UIcon
                  :name="acc.icon"
                  class="w-6 h-6 text-primary"
                />
              </div>

              <div>
                <h3 class="font-bold text-slate-900">
                  {{ acc.title }}
                </h3>
                <p class="mt-1 text-sm text-slate-600">
                  {{ acc.desc }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end">
          <UButton
            variant="ghost"
            @click="showAccountModal = false"
          >
            Cancel
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
:global(:root){
  --color-primary: #081D3C;
  --color-Sequand: #59BAFF;
  --color-background: #F4F8FE;
  --color-secondary: #9FBEDD;
}

.bg-app{
  background: var(--color-background);
}

.text-primary{
  color: var(--color-primary);
}
.bg-primary{
  background: var(--color-primary);
}
.border-primary{
  border-color: var(--color-primary);
}

.hero-grad{
  background: radial-gradient(closest-side, rgba(89,186,255,0.35), rgba(89,186,255,0));
}
.hero-grad2{
  background: radial-gradient(closest-side, rgba(159,190,221,0.45), rgba(159,190,221,0));
}

.community-wrap{
  background: linear-gradient(180deg, rgba(244,248,254,1) 0%, rgba(244,248,254,1) 60%, rgba(244,248,254,1) 100%);
}
</style>
