<template>
	<v-card flat>
		<v-row>
			<WidgetItems
				chart="工作线程"
				color="orange"
				:duration="2000"
				:end="Info.isLoading ? Number(Info.ClusterInfo.GoroutineNum) : 0"
				icon="mdi-server-network"
				:start="1"
				title="工作线程"
			/>
			<WidgetItems
				chart="Saya Modules"
				color="blue"
				:duration="3000"
				:end="Info.Plugins"
				icon="mdi-power-plug-outline"
				:start="1"
				title="Saya Modules"
			/>
			<WidgetItems
				chart="在线用户"
				color="pink"
				:duration="3000"
				:end="Info.isLoading ? Number(Info.QQUsersCounts) : 0"
				icon="mdi-qqchat"
				:start="1"
				title="在线用户"
			/>
			<WidgetItems
				chart="稳定运行"
				color="indigo"
				:duration="3000"
				:end="Info.isLoading ? Number(Info.RunTime) : 0"
				icon="mdi-timeline-plus"
				:start="1"
				title="稳定运行"
			/>
			<v-col cols="12" xs="6" sm="6" md="5">
				<v-skeleton-loader
					type="list-item-two-line,list-item-two-line,list-item-two-line,list-item-two-line,list-item-two-line,list-item-two-line"
					:loading="!System.isLoading"
				>
					<v-card flat :loading="!System.isLoading">
						<v-card-title>系统信息</v-card-title>
						<v-list dense>
							<v-list-item
								v-show="index !== 'isLoading'"
								v-for="(data, index) in System"
								:key="index"
							>
								<v-list-item-content>{{ index }}</v-list-item-content>
								<v-list-item-content>
									{{ data }}
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card>
				</v-skeleton-loader>
			</v-col>
			<v-col cols="12" xs="6" sm="6" md="7">
				<v-skeleton-loader :loading="!System.isLoading" type="card,card">
					<v-card flat>
						<v-card-title>仪表盘</v-card-title>
						<v-card-text>
							<v-list-item three-line>
								<v-list-item-avatar size="80">
									<v-icon size="64" color="purple">mdi-tag</v-icon>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title class="title font-weight-light">
										Avilla版本
									</v-list-item-title>
									<v-list-item-subtitle>
										{{ Info.AvillaVersion }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item three-line>
								<v-list-item-avatar size="80">
									<v-icon size="64" color="info">mdi-language-python</v-icon>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title class="title font-weight-light">
										Python版本
									</v-list-item-title>
									<v-list-item-subtitle v-if="Info.PythonVersion">
										{{ Info.PythonVersion }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item three-line>
								<v-list-item-avatar size="80">
									<v-icon size="64" color="info">mdi-tag</v-icon>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title class="title font-weight-light">
										Avilla Protocol
									</v-list-item-title>
									<v-list-item-subtitle v-if="Info.AvillaProtocol">
										{{ Info.AvillaProtocol }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-card-text>
					</v-card>
				</v-skeleton-loader>
			</v-col>
			<v-col cols="12">
				<v-skeleton-loader :loading="!System.isLoading" type="card">
					<v-card flat>
						<v-card-text><ve-line :data="chartData"></ve-line></v-card-text>
					</v-card>
				</v-skeleton-loader>
			</v-col>
		</v-row>
	</v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WidgetItems from '@/components/WidgetItems.vue'
import { SystemInfo } from '@/models/SystemInfo'
var config = require('../../config.json')
import dayjs from 'dayjs'

export interface chartData {
	columns: string[]
	rows: Row[]
}

export interface Row {
	date: string
	CPU占用: string
	内存占用: string
	网络收包: number
	网络发包: number
}

export interface SystemRoot {
	isLoading?: boolean
	CPU核数?: number
	CPU?: string
	系统?: string
	平台?: string
	内存?: string
	IP?: string
	运行时间?: string
}

@Component<Dashboard>({
	components: {
		WidgetItems
	}
})
export default class Dashboard extends Vue {
	time = 0
	wsfirst = false
	Info: SystemInfo = {
		isLoading: false
	}

	System: SystemRoot = {
		isLoading: false
	}

	chartData: chartData = {
		columns: ['date', 'CPU占用', '内存占用', '网络收包', '网络发包'],
		rows: []
	}

	async created(): Promise<void> {
		var ws = new WebSocket(config.wsapi + '/sys/info/ws')
		var data = await new Promise<SystemInfo>((resolve) => {
			ws.onmessage = (event) => {
				data = JSON.parse(event.data)
				this.Info = data
				this.Info.isLoading = true
				this.chartData.rows.push(<Row>{
					date: dayjs(new Date()).format('H:m:s'),
					CPU占用: data.SystemUsage?.CpuUsage,
					内存占用: data.SystemUsage?.MemUsage,
					网络收包: data.SystemUsage?.NetReceive,
					网络发包: data.SystemUsage?.NetSend
				})
				Object.assign(this.System, <SystemRoot>{
					isLoading: true,
					CPU核数: data.CPUH,
					CPU: data.CPUName,
					系统: data.OSSName,
					平台: data.OS,
					内存: data.MMInfo,
					IP: data.IP,
					运行时间: data.UPtime
				})
				this.Info.isLoading = false
			}
			ws.onclose = () => {
				this.Info.isLoading = true
				alert("WebSocket连接已断开！");
			    location.reload()
			}
		})
	}
}
</script>
