export const columns = [
  {
    type: 'selection',
    span: 8,
    fixed: 'left',
  },
  {
    name: 'name',
    label: '歌手',
    search: true,
    sortable: true,
    valueType: 'input',
    span: 8,
    width: 120,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'birthday',
    label: '诞生日期',
    sortable: false,
    valueType: 'input',
    width: 120,
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'sex',
    label: '性别',
    search: true,
    valueType: 'select',
    width: 80,
    span: 8,
    options: [
      {
        value: 1,
        label: '男',
      },
      {
        value: 0,
        label: '女',
      },
    ],
    formatter: (row) => {
      if (row.sex === 1) return '男'
      if (row.sex === 0) return '女'
      return '未知'
    },
  },
  {
    name: 'singerType',
    label: '歌手类型',
    valueType: 'input',
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
    formatter: (row) => {
      if (row.singerType === 1) return '独立歌手'
      if (row.singerType === 2) return '乐队'
      return '未知'
    },
  },
  {
    name: 'operation',
    slot: true,
    fixed: 'right',
    label: '操作',
    width: 180,
  },
]
