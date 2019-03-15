## Amazon TAM (apstag) Creative

By default, Amazon serves ads in normal iframes, not SafeFrames. The default apstag creative is:

```
<script>var amzn_win=window,amzn_c=5,amzn_x=0;while(amzn_x<amzn_c){amzn_win=amzn_win.parent;if(amzn_win.apstag)try{amzn_win.apstag.renderImp(document,"%%PATTERN:amzniid%%");amzn_x=amzn_c}catch(e){}amzn_x++};</script>
```

Or, prettified:

```
<script>
  var amzn_win = window,
    amzn_c = 5,
    amzn_x = 0;
  while (amzn_x < amzn_c) {
    amzn_win = amzn_win.parent;
    if (amzn_win.apstag) try {
      amzn_win.apstag.renderImp(document, "%%PATTERN:amzniid%%");
      amzn_x = amzn_c
    } catch (e) {}
    amzn_x++
  };
</script>
```

This creative relies on access to the top frame's `apstag` variable and associated state.

In a SafeFrame, this creative won't work because it won't have access to the parent window. Instead, we can have the creative post a message to the parent window with the ad ID, and then the parent window can call `apstag.renderImp`, then pass back the ad document's HTML for the creative to render.

```
  try {
    // Listen for a response from the parent page.
    window.addEventListener(
      'message',
      function(event) {
        // Make sure the message comes from one of our domains.
        if (
          [
            'https://tab.gladly.io',
            'https://dev-tab2017.gladly.io',
            'https://localhost:3000',
            'https://local-dev-tab.gladly.io:3000',
          ].indexOf(event.origin) < 0
        ) {
          return false
        }

        // Make sure this is an apstag response.
        if (!event.data || event.data.type !== 'apstagResponse') {
          return false
        }

        if (!event.data || !event.data.adDocumentData) {
          console.error(
            'The message from the parent did not contain an "adDocumentData" object.'
          )
          return false
        }
        var adDocumentData = event.data.adDocumentData

        // Update the ad document with the rendered HTML.
        window.document.cookie = adDocumentData.cookie
        window.document.head.innerHTML = adDocumentData.headHTML
        window.document.title = adDocumentData.title
        window.document.body.innerHTML = adDocumentData.bodyHTML
        return true
      },
      false
    )

    // Message the parent page.
    window.parent.postMessage(
      {
        type: 'apstag',
        // Our ad server replaces this placeholder.
        adId: '%%PATTERN:amzniid%%',
      },
      '*'
    )
  } catch (e) {
    console.error(e)
  }
```

See [this issue](https://github.com/gladly-team/tab/issues/481) for why we want to render Amazon creative in a SafeFrame.
