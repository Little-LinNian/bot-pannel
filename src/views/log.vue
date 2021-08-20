<template>
	<v-card flat>
		<v-list flat>
			<v-subheader>Logs</v-subheader>
			<v-list-item-group v-model="selectedItem" color="primary">
				<v-list-item
					v-for="(item, index) in LogsList"
					:key="index"
				>
					<v-list-item-content>
						{{ item }}
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-card>
</template>
<script lang="ts">
var config = require('../../config.json')
import { Component, Vue } from 'vue-property-decorator'
import 'codemirror/mode/lua/lua.js'
import 'codemirror/theme/seti.css'
@Component<Plugins>({})
export default class Plugins extends Vue {
	[x: string]: any
	LogCache: String = ""
	LogsList: String[] = []

	async created(): Promise<void> {
		await this.GetMessage()
	}
	
	async GetMessage(): Promise<void> {
		var ws = new WebSocket(config.wsapi + '/logs')
		ws.onmessage = (event) => {
			ws.send('OK')
			if (event.data === this.LogCache){
				return
			}
			this.LogCache = event.data
			this.LogsList.push(event.data)

		}
	
	}

}

</script>
<style lang="stylus">
.CodeMirror {
  position: absolute;
  height: calc(100vh - 128px);
  height: calc(100vh - var(--vh-offset, 0px) - 128px);
  width: calc(100% - 32px);
}
</style>
