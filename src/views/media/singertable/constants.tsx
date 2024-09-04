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
    valueType: 'input',
    width: 80,
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'singerType',
    label: '创作人类型',
    valueType: 'input',
    span: 8,
    attrs: {
      placeholder: '请输入',
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
