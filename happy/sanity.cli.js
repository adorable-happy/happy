import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e18cmrnu', // 정미님의 프로젝트 ID
    dataset: 'production'
  },
  deployment: {
    appId: 'd3u2s7vaai8y89vmevz72qe1', // 터미널이 알려준 ID
  }
})
