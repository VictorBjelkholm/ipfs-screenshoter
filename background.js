// Create IPFS node
const ipfs = new Ipfs()

// Try to print out the number of peers every 5 seconds
setInterval(() => {
  ipfs.swarm.peers((err, peers) => {
    if (err) throw err
    const len = peers.length
    console.log('Peers: ' + len)
  })
}, 5000)

// Indicate that we're still booting the node
browser.browserAction.setBadgeText({text: "..."})

const onError = (err) => {
  console.log(err)
  // Make sure we make errors noticeable
  browser.browserAction.setBadgeText({text: "!!!"})
}

ipfs.once('ready', () => {
  // Once ready, clear badge text
  browser.browserAction.setBadgeText({text: ""})
})

ipfs.on('error', onError)

// When clicking the toolbar button
browser.browserAction.onClicked.addListener(function() {
  // Take screenshot of current tag
  browser.tabs.captureVisibleTab().then((imageUri) => {
    console.log(imageUri);
    // Take just image data
    const img = atob(imageUri.split(',')[1])

    // Make into Uint8Array
    var ia = new Uint8Array(img.length);
    for (var i = 0; i < img.length; i++) {
        ia[i] = img.charCodeAt(i);
    }

    // Filename with current date and time
    const filename = `screenshot-${(new Date()).toISOString()}.png`

    // Add to IPFS and wrap in directory
    ipfs.files.add({
      path: `directory/${filename}`,
      content: new ipfs.types.Buffer(ia)
    }, (err, res) => {
      if (err) throw err

      // Take directory hash and use filename to ensure browser render
      const dir = res[1].hash
      const fullUrl = `https://ipfs.io/ipfs/${dir}/${filename}`

      console.log(fullUrl)

      // Finally create new tab with image linked via gateway
      browser.tabs.create({
        url: fullUrl
      })
    })
  }, onError)
})
