import styled, { keyframes } from 'styled-components'

export const ImageAsyncContainer = styled.div`
  position: relative;
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Image = styled.div`
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const ImageAsyncFallback = Image.extend`
  z-index: 1;
  animation: ${props => props.fadeOut ? `${fadeOut} .3s forwards` : 'none'};
  display: ${props => props.hidden ? 'none' : 'block'}
`

export const ImageAsyncReal = Image.extend`
  z-index: 2;
  background-image: url(${props => props.url});
  opacity: 0;
  animation: ${fadeIn} .3s forwards;
`

export const ImageContent = styled.div`
  position: relative;
  z-index: 3;
`
