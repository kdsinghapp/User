import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatBot = () => {
  const chatWidgetScript = `
    <html>
      <head>
        <script src="https://widgets.leadconnectorhq.com/loader.js" 
                data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" 
                data-widget-id="66f8cc382e88526e3ce2d1f7">
        </script>
      </head>
      <body>
        <div id="chat-widget-container"></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: chatWidgetScript }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ChatBot;
