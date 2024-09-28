const { createApp } = Vue;

createApp({
  data() {
    return {
      inputJson: '', // 存放輸入的 JSON 字符串
      duplicateJson: '', // 存放重覆 Key 的結果
      alertMessage: '', // 提示訊息
    };
  },
  methods: {
    // 檢查重覆的 Keys
    checkDuplicate() {
      try {
        this.alertMessage = ''; // 清除警告
        const inputText = this.inputJson; // 取得輸入的 JSON 字符串
    
        // 用正則表達式解析 JSON 中的 key 和 value
        /*
          "：與前一個正則表達式相同，匹配 JSON key 的開頭雙引號。

          ([^"]+)：與前面一樣，這是用來捕獲 JSON key 名稱的部分。它會捕獲雙引號之間的 key 名字。

          \s*:\s*：這部分與前面類似，匹配 key 後面的冒號及冒號周圍的空白字符。這裡的空白字符用 \s* 表示，可以有零個或多個空白字符。

          ([^,}]+)：這是另一個捕獲組，匹配 key 後面的值部分。它的作用是捕獲冒號後面的值，直到遇到逗號 , 或右花括號 } 為止。解釋如下：

          [^,}]：這是一個字符類，匹配「不是逗號和右花括號」的字符。換句話說，它會匹配值，直到遇到 JSON 中的值結束符號（逗號或右花括號）。
          +：匹配「一個或多個」值字符。
          g：全局標誌，表示會在整個輸入字符串中多次查找匹配。
         */
        const keyValueRegex = /"([^"]+)"\s*:\s*([^,}]+)/g;
        let match;
        const keyValues = {}; // 用來記錄每個 key 和它對應的所有 value
        const keyCount = {};  // 計數每個 key 出現的次數
    
        // 循環查找所有的 key 和它們的 value
        while ((match = keyValueRegex.exec(inputText)) !== null) {
          const key = match[1];
          const value = match[2].trim(); // 獲取 value 值，並去掉多餘空白字符
    
          // 如果 key 已存在，累加它的出現次數，並記錄其 value
          if (keyCount[key]) {
            keyCount[key] += 1;
            keyValues[key].push(value);
          } else {
            // 如果 key 是第一次出現，初始化計數和對應的 value 列表
            keyCount[key] = 1;
            keyValues[key] = [value];
          }
        }
    
        // 初始化結果區
        this.duplicateJson = '';
    
        // 找出重覆的 key，並顯示 key 和它們對應的所有 value
        for (const key in keyCount) {
          if (keyCount[key] > 1) {
            this.duplicateJson += `${key}, Occurrences/出現次數: ${keyCount[key]}\n---\n`;
            keyValues[key].forEach(value => {
              this.duplicateJson += `"${key}": ${value}\n`;
            });
            this.duplicateJson += '\n'; // 添加換行符以便區分每個重覆的 key
          }
        }
    
        if (this.duplicateJson === '') {
          this.duplicateJson = 'No Duplicate Keys / 沒有重覆的 Keys';
        }
      } catch (e) {
        this.alertMessage = ' An error occurred during processing! / 處理過程中出現錯誤！';
      }
    },
  }
}).mount('#app');
