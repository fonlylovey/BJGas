const SEGMENTS = [
  {
    title: '',
    body: '',
    image: 'g',
    camera: { pos: [2.76, 6.37, 3.82], target: [0, 0, 0] },
    highlightParts: [],
  },
  {
    title: '基础监测',
    body: '通过集成物联网通信模块与多类型传感器，对调压箱运行参数（进出口压力、流量、过滤器压差等）、关键部件状态及安全报警信息进行连续采集与低延迟上传，实现设备运行状态的实时感知与全天候可视化监管。',
    image: 'placeholder/basic-monitoring.png',
    camera: { pos: [1.8, 5.2, 3.14], target: [-0.2, 0.25, 0] },
    highlightParts: ['pressureIn', 'pressureOut', 'filterDiff', 'flowMeter', 'ventMonitor', 'leakMonitor'],
  },
  {
    title: '远程调控',
    body: '通过在入口侧配置电动调节阀及调压器远程切断装置，实现调压系统远程调节与紧急处置功能。系统可依据平台指令或预设安全策略，对运行状态进行自动/手动控制；当发生超压、严重泄漏或其他重大故障时，执行整体切断，防止事故扩大。',
    image: 'placeholder/remote-control.png',
    camera: { pos: [-1.1, 4.0, 2.3], target: [0.15, 0.4, 0] },
    highlightParts: ['actuator', 'valve1', 'valve2'],
  },
  {
    title: '在线诊断',
    body: '根据高频传感器数据采集，结合AI算法，可对调压器喘振、运行压力异常、关闭压力异常、切断阀失效、过滤器堵塞、燃气泄漏等的常见故障进行实时监测与诊断，并主动上报，自动生成维护方案。',
    image: 'placeholder/online-diagnosis.png',
    camera: { pos: [0.0, 4.5, 1.4], target: [0, 0.35, 0] },
    highlightParts: ['regulator', 'sensorNode1', 'sensorNode2'],
  },
  {
    title: '供电保障',
    body: '自驱电源+锂电池储能，为箱内所有用电设备（高频传压力感器、物联网通信模块、人机界面等）提供持续、稳定的电力供应，免除外部电源依赖，增强系统在无电或断电区域的适用性与可靠性。支持换电时不间断工作，保障停气时设施持续在线。',
    image: 'placeholder/power-assurance.png',
    camera: { pos: [-0.14, 6, 2.1], target: [-0.35, 0.3, 0] },
    highlightParts: ['powerIn', 'generator', 'battery'],
  },
  {
    title: '扩展安全',
    body: '调压箱进口增电动调节阀，下游管网关键节点布设传感设备，依托专业模型数据建模分析，实现下游管网微小泄漏风险早期预警，提升区域燃气供应安全等级。',
    image: 'placeholder/safety-and-hmi.png',
    camera: { pos: [-0.95, 2.7, 0.0], target: [0.17, 0.2, -0.1] },
    highlightParts: ['downstreamAlarm', 'hmiPanel', 'leakMonitor'],
  },
  {
    title: '自驱电源',
    body: '在调压箱中预装，省去接入市电的施工安装费用和手续费。占用空间积小，结构简单，不受天气影响，运行仅与燃气流动有关，发电时间更长，稳定性强。最高发电功率可达1000W，蓄电池可以根据实际工况选配，进一步节省维护费用。通过燃气自驱电源及储能模块，保障调压箱内数据的高频采集及实时AI监控，实现燃气设备设施的在线故障自诊断。',
    image: 'placeholder/generator.png',
    camera: { pos: [0.49, 2.6, 1.19], target: [0, 0.23, 0.24] },
    highlightParts: ['generator'],
  },
  {
    title: '智能调压器',
    body: '解决传统自力式调压器智慧化程度不高，易损件多，维护频繁等问题。<br><b>核心技术亮点</b><br>六合一集成化设计：集调压器、流量计、限流阀、切断阀、监控调压器、物联网数据终端于一体。<br>模块化免维护设计：核心的精密控制器无需维修。<br>断电无缝切换设计：断电后调压器由电动模式无缝切换到传统机械调压模式。<br><b>应用场景</b><br>适配于需稳定低压供气、智能管控压力的燃气输配末端场景',
    image: 'placeholder/regulator.png',
    camera: { pos: [-1.0, 1.9, -1], target: [0.21, 0.28, -1.0] },
    highlightParts: ['regulator'],
  }
];

export const SEGMENTSData = SEGMENTS;