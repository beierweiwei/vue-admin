import  {SITE} from '@/config'

export default {
	data () {
		return {
			imgName: '',
			uploadList: [],
			defaultList: [],
	    imgViewVisible: false,
	    baseUrl: SITE.origin,
		}
	},
	methods: {
		handleView (name) {
		  this.imgName = name
		  this.imgViewVisible = true
		},
		handleRemove (file) {
		  const fileList = this.$refs.upload.fileList
		  this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
		},
		handleSuccess (res, file) {
		  file.url = SITE.origin + res.data.serverPath
		  file.name = res.data.fileName
		},
		handleFormatError (file) {
		  this.$Notice.warning({
		    title: 'The file format is incorrect',
		    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
		  })
		},
		handleMaxSize (file) {
		  this.$Notice.warning({
		    title: 'Exceeding file size limit',
		    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
		  })
		},
		handleBeforeUpload () {
		  const check = this.uploadList.length < 5
		  if (!check) {
		    this.$Notice.warning({
		      title: 'Up to five pictures can be uploaded.'
		    })
		  }
		  return check
		}
	}
}