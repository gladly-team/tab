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

In a SafeFrame, this creative won't work because it won't have access to the parent window. Instead, we can have the creative post a message to the parent window with the ad ID, and then the parent window can call `apstag.renderImp`.

```
try {
  window.parent.postMessage({
    type: 'apstag',
    adId: "%%PATTERN:amzniid%%"
  }, '*')
} catch (e) {
  console.error(e)
}
```
