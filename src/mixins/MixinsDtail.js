import { ALIAS_URL } from "../api/Intelligent.js"
export default {
  data () {
    return {
      headInfo: {},
      aliasName: ''
    }
  },
  methods: {
    selectAliasByNo () {
      this.$api.post(ALIAS_URL, {iboxNo: this.parameters.iboxNo}).then(backInfo => {
        if (backInfo.isSuccess) {
          this.headInfo = backInfo.response
        } else {
          this.showToast(backInfo.message);
        }
      })
    }
  }
}