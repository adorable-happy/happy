export const projectType = {
  name: 'project',
  title: '프로젝트',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '프로젝트 제목',
      type: 'string',
      validation: Rule => Rule.required()
    },
    
    {
      name: 'category',
      title: '카테고리',
      type: 'string',
      options: {
        list: [
          {title: 'Promotion', value: 'Promotion'},
          {title: 'Proposal', value: 'Proposal'},
          {title: 'Site', value: 'Site'},
          {title: 'OOH', value: 'OOH'},
        ],
      },
    },
    {
      name: 'year',
      title: '제작 연도',
      type: 'string',
    },
    {
      name: 'mainImage',
      title: '메인 썸네일 (목록용)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'contentImages',
      title: '상세 페이지 이미지들',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'description',
      title: '프로젝트 설명',
      type: 'text',
      rows: 5,
    },
  ],
}