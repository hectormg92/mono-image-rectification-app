export default {

    readImage(localPath) {
        const img = document.createElement('img')
            return new Promise((res, rej) => {
                img.src = localPath
                img.addEventListener('load', (event) => {
                const { naturalWidth, naturalHeight } = img
                console.log('img', naturalWidth, naturalHeight)
                res([naturalWidth, naturalHeight])
            })
        })
    }


}