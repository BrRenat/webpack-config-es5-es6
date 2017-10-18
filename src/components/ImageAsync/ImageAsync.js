import React, { Component, PropTypes } from 'react'
import loadImage from 'utils/loadImage'
import isImageCached from 'utils/isImageCached'

import {
  ImageAsyncContainer,
  ImageAsyncFallback,
  ImageAsyncReal,
  ImageContent,
} from './styles'

class ImageAsync extends Component {
  constructor (props) {
    super(props)

    const { src } = props
    const cached = isImageCached(src)

    this.state = {
      cached,
      loaded: false,
      failed: false,
    }
  }

  componentDidMount () {
    this.isMount = true
    this.loadImage()
  }

  componentWillUnmount () {
    this.isMount = false
  }

  loadImage () {
    loadImage(this.props.src)
      .then(() => this.isMount && this.setState({ loaded: true }))
      .catch(() => this.isMount && this.setState({ failed: true }))
  }

  render () {
    const { src, className, children } = this.props
    const { cached, loaded } = this.state

    return (
      <ImageAsyncContainer className={className}>
        <ImageAsyncFallback
          hidden={cached}
          fadeOut={loaded}
        />
        {loaded &&
          <ImageAsyncReal
            url={src}
          />
        }
        <ImageContent>
          {children}
        </ImageContent>
      </ImageAsyncContainer>
    )
  }
}

ImageAsync.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

// Необходимо чтобы для разных автаров создавался отдельный инстанс класса ImageAsync
// т.к. часть логики по плавномку отображению картинки находится в конструкторе
// eslint-disable-next-line
export default props => <ImageAsync key={props.src} {...props} />
