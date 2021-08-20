<template>
	<v-card flat>
		<v-row>
			<v-col cols="12" sm="12">
				<v-card-text>
					<v-sheet
						class="overflow-y-auto fill-height fill-weight"
						max-height="100vh"
						tile
					>
						<v-skeleton-loader
							type="list-item-two-line,list-item-two-line,list-item-two-line,list-item-two-line,list-item-two-line"
							:loading="!modules.length === 0"
						>
							<v-list flat>
								<v-subheader>已启用Mods列表</v-subheader>
								<v-list-item-group v-model="selectedItem" color="primary">
									<v-list-item
										v-for="(item, index) in modules"
										:key="index"
										@click="
											GetOneModule(item.SayaName, index)
											ModuleInstalled = true
										"
									>
										<v-list-item-avatar>
											<v-icon>mdi-language-python</v-icon>
										</v-list-item-avatar>
										<v-list-item-content>
											模块:
											<v-list-item-title>{{
												item.SayaName
											}}</v-list-item-title>
											作者:
											<v-list-item-subtitle>{{
												item.author
											}}</v-list-item-subtitle>
											模块名:
											<v-list-item-subtitle>{{
												item.ChannelName
											}}</v-list-item-subtitle>
											描述:
											<v-list-item-subtitle>{{
												item.description
											}}</v-list-item-subtitle>
										</v-list-item-content>
									</v-list-item>
								</v-list-item-group>
							</v-list>
							<v-list flat>
								<v-subheader>已禁用Mods列表</v-subheader>
								<v-list-item-group v-model="selectedItem" color="primary">
									<v-list-item
										v-for="(item, index) in UninstallModules"
										:key="index"
										@click="
											GetOneModule(item.SayaName, index)
											ModuleInstalled = false
										"
									>
										<v-list-item-avatar>
											<v-icon>mdi-language-python</v-icon>
										</v-list-item-avatar>
										<v-list-item-content>
											模块:
											<v-list-item-title>{{
												item.SayaName
											}}</v-list-item-title>
											作者:
											<v-list-item-subtitle>{{
												item.author
											}}</v-list-item-subtitle>
											模块名:
											<v-list-item-subtitle>{{
												item.ChannelName
											}}</v-list-item-subtitle>
											描述:
											<v-list-item-subtitle>{{
												item.description
											}}</v-list-item-subtitle>
										</v-list-item-content>
									</v-list-item>
								</v-list-item-group>
							</v-list>
						</v-skeleton-loader>
					</v-sheet>
				</v-card-text>
			</v-col>
			<v-fab-transition>
				<v-btn v-if="PythonFileSrc" color="pink" dark fixed bottom right fab>
					<v-icon v-if="ModuleInstalled" @click="UninstallModule(PythonFileName)"
						>mdi-close</v-icon
					>
					<v-icon v-else @click="InstallModule(PythonFileName)">mdi-check</v-icon>
				</v-btn>
			</v-fab-transition>
			<v-col cols="12" sm="9">
				<v-text-field
					v-if="PythonFileName"
					label="插件名"
					v-model="PythonFileName"
				></v-text-field>
				<codemirror v-if="PythonFileSrc" v-model="PythonFileSrc" :options="cmOptions" />
			</v-col>
		</v-row>
	</v-card>
</template>
<script lang="ts">
var config = require('../../config.json')
import { Component, Vue } from 'vue-property-decorator'
import 'codemirror/mode/python/python.js'
import 'codemirror/theme/seti.css'
interface SayaModule {
	SayaName: string
	ChannelName?: string
	description?: string
	author?: string
}

@Component<Plugins>({})
export default class Plugins extends Vue {
	[x: string]: any
	selectedItem = -1
	modules: SayaModule[] = []
	UninstallModules: SayaModule[] = []
	PythonFileName = ''
	PythonFileSrc = ''
	ModuleInstalled = false
	Module = ''
	cmOptions = {
		tabSize: 4,
		mode: 'python',
		theme: 'seti',
		lineNumbers: true,
		line: true
	}

	async created(): Promise<void> {
		await this.GetPluginsList()
	}

	async GetPluginsList(): Promise<void> {
		var xmlhttpinstall = new XMLHttpRequest()
		xmlhttpinstall.open('GET', config.api + '/saya/list', true)
		xmlhttpinstall.onreadystatechange = () => {
			if (xmlhttpinstall.readyState === 4 && xmlhttpinstall.status === 200) {
				var modules = JSON.parse(xmlhttpinstall.responseText)['modules']
				modules.forEach((mod: SayaModule) => {
					this.modules.push(mod)
				})
			}
		}
		xmlhttpinstall.send()
		var xmlhttpuninstall = new XMLHttpRequest()
		xmlhttpuninstall.open('GET', config.api + '/saya/list/disable', true)
		xmlhttpuninstall.onreadystatechange = () => {
			if (xmlhttpuninstall.readyState === 4 && xmlhttpuninstall.status === 200) {
				var modules = JSON.parse(xmlhttpuninstall.responseText)['modules']
				modules.forEach((mods: SayaModule) => {
					this.UninstallModules.push(mods)
				})
			}
		}
		xmlhttpuninstall.send()
	}
	async UninstallModule(name: string): Promise<void> {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.open('GET', config.api + '/saya/uninstall?name=' + name, true)
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				alert(name + ' 已卸载')
				location.reload()
			}
		}
		xmlhttp.send()
	}
	async InstallModule(name: string): Promise<void> {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.open('GET', config.api + '/saya/install?name=' + name, true)
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				alert(name + ' 已安装')
				location.reload()
			}
		}

		xmlhttp.send()
	}

	async GetOneModule(name: string, k: number): Promise<void> {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.open('GET', config.api + '/getcode?name=' + name, true)
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				this.selectedItem = k
				this.PythonFileSrc = JSON.parse(xmlhttp.responseText)['code']
				this.PythonFileName = name
			}
		}
		xmlhttp.send()
	}

	async EditOnePlugin(): Promise<void> {
		this.$socket.emit(
			'EditOnePlugin',
			{ LuaFileName: this.LuaFileName, LuaFileSrc: this.LuaFileSrc },
			(data: { Msg: string; Ret: number }) => {
				if (data.Ret === -1) {
					this.$snotify.error(data.Msg)
				} else {
					this.$snotify.success(data.Msg)
					this.LuaFileName = ''
					this.LuaFileSrc = ''
					this.GetPluginsList()
					this.selectedItem = -1
				}
			}
		)
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
