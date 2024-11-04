// name 属性有一定要求，就是根据路径层级必须 大驼峰命名，入 /home/top/top1  =>  HomeTopTop1  这样做的目的是保持唯一性 对应路由中的 name 属性
const config = {
  name: 'Manage',
  title: '管理',
  icon: 'IconMenu',
  sort: 1,
  menu: true
}
export default {
  config,
}
