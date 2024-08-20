export const columns = [
  {
    type: 'selection',
    span: 8,
    fixed: 'left',
  },
  {
    name: 'singerName',
    label: '歌手',
    search: true,
    sortable: true,
    valueType: 'input',
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'musicUrl',
    label: '音频地址',
    sortable: true,
    valueType: 'input',
    width: 180,
    span: 12,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'imageUrl',
    label: '图片地址',
    valueType: 'input',
    width: 180,
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'miniImageUrl',
    label: '缩略图',
    valueType: 'input',
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'musicName',
    label: '音频名',
    sorter: true,
    search: true,
    valueType: 'input',
    span: 8,
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    name: 'musicTimeLength',
    label: '音频时长(S)',
    width: 120,
  },
  {
    name: 'operation',
    slot: true,
    fixed: 'right',
    label: '操作',
    width: 180,
  },
]
