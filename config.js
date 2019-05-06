var json = {
  name: "root",
  children: [
    {
			key: 'allPath',
      name: "全路径",
			children: [
				{ name: "作为起点", size: 1, key: 'allPathStart'}, 
				{ name: "作为终点", size: 1, key: 'allPathEnd' }
			]
    },
    {
			key: 'shortPath',
      name: "最短路径",
      children: [
				{ name: "作为起点", size: 1, key: 'shortPathStart' }, 
				{ name: "作为终点", size: 1, key: 'shortPathStart',
				children: [
					{ name: "作为起点", size: 1, key: 'shortPathStart2' }, 
					{ name: "作为终点", size: 1, key: 'shortPathStart2' }
				] }
			]
    },
    { name: "实体展开", size: 2, key: 'expand' },
    { name: "图内路径", size: 2, key: 'graphPath' },
    { name: "折叠", size: 2, key: 'fold' },
    { name: "锁定", size: 2, key: 'lock' },
    { name: "隐藏", size: 2, key: 'hide' }
  ]
}
