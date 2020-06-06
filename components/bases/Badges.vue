<template>
  <div>
    <a
      v-for="image in images"
      :key="image.link"
      :href="image.link"
      target="_blank"
      class="badge"
    >
      <img :alt="image.alt" :src="image.src" />
    </a>
  </div>
</template>

<script>
const badgeTemplate = {
  'npm:version': {
    src: 'https://img.shields.io/npm/v/[project]',
    link: 'https://www.npmjs.com/package/[project]'
  },
  'npm:dt': {
    src: 'https://img.shields.io/npm/dt/[project]',
    link: 'https://www.npmjs.com/package/[project]'
  },
  'gitlab:pipeline': {
    src: 'https://gitlab.com/[user]/[project]/badges/master/pipeline.svg',
    link: 'https://gitlab.com/[user]/[project]'
  },
  'gitlab:coverage': {
    src: 'https://gitlab.com/[user]/[project]/badges/master/coverage.svg',
    link: 'https://gitlab.com/[user]/[project]'
  },
  'npm:license': {
    src: 'https://img.shields.io/npm/l/[project]',
    link: 'https://github.com/[user]/[project]/blob/development/LICENSE'
  }
}

export default {
  props: {
    badges: {
      type: Array,
      default: () => []
    },
    project: {
      type: String,
      default: () => ''
    },
    user: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    images () {
      const out = []
      this.badges.forEach((badge) => {
        if (badgeTemplate[badge]) {
          out.push({
            alt: badge.split(':')[0],
            src: badgeTemplate[badge].src
              .replace('[project]', this.project)
              .replace('[user]', this.user),
            link: badgeTemplate[badge].link
              .replace('[project]', this.project)
              .replace('[user]', this.user)
          })
        }
      })
      return out
    }
  }
}
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px;
}
</style>
