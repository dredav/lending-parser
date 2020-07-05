<template>
 <div>
  <div class="custom-file">
    <input type="file" class="custom-file-input" id="customFile" multiple @change="loadFiles">
    <label class="custom-file-label" for="customFile">Choose a file</label>
  </div>
  <div class="mt-3" v-if="files.length > 0">
    <h2>Imported files:</h2>
    <ul class="pl-0" v-for="(file, index) in files" v-bind:key="index">
      <li class="list-group-item">
        File: {{ file.name }}<br>
        Status: {{ file.state }}<br>
        Number of investments: {{ file.count }}
      </li>
    </ul>
  </div>
 </div>
</template>

<script>
import xlxs from 'xlsx'
import { getParserForInvestments } from '../src'
import Big from 'big.js';

export default {
  name: "App",
  data: () => ({
    files: [],
    investments: []
  }),
  mounted() {
  },
  methods: {
    loadFiles(event) {
      let investments = [];
      Array.from(event.target.files).map(file => {
        const reader = new FileReader();
        reader.onload = content => {
          let state = undefined;
          let investmentCount = 0;

          try {
            const parser = getParserForInvestments(file.name)
            parser.parseFileIntoInvestments(file.name, content.target.result).map(investment => {
              investmentCount++;
              this.investments.push(investment);
            });

            state = 'Parsed';
          } catch (error) {
            state = 'Error: ' + error;
          }

          console.log(this.investments)

          this.files.unshift({
            name: file.name,
            state: state,
            count: investmentCount
          })
        };

        reader.readAsArrayBuffer(file);
      });
    }
  }
};
</script>