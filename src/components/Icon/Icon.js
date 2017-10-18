import React, { PropTypes } from 'react'

const Icon = ({ src, onClick, className }) => {
  if (!src) {
    return null
  }

  // TODO: fix when the following issue will be resolved
  // https://github.com/kisenka/svg-sprite-loader/issues/32
  if (!src) return null
  const { width, height } = document.querySelector(src).viewBox.baseVal

  return (
    // @TODO: it shouldn't highlight error when role="button" specified
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    // eslint-disable-next-line
    <span
      role="button"
      onClick={onClick}
      className={className}
    >
      <svg
        width={`${width}px`}
        height={`${height}px`}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        focusable={false}
      >
        <use xlinkHref={src} />
      </svg>
    </span>
  )
}

Icon.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
}


export default Icon
