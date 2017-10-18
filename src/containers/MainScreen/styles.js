import styled from 'styled-components'

import ImageAsync from 'components/ImageAsync'

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Image = styled(ImageAsync)`
  width: 400px;
  height: 200px;
  
  display: block;
  margin: auto;
`
