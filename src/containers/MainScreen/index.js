import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import { testAction } from 'redux/test/actions'
import { testActionResultSelector } from 'redux/test/selectors'

import { MainContainer, Image } from './styles'

const mapDispatchToProps = {
  testAction,
}

const mapStateToProps = createStructuredSelector({
  testActionResult: testActionResultSelector,
})

class MainScreen extends Component {

  render () {
    const testBuilder = () => {
      const es6 = 'ecma2015'

      console.log(`test that ${es6}`)
    }

    return (
      <MainContainer>
        Main page
        <Image src="http://www.menucool.com/slider/ninja-slider/img/abc.jpg"/>
      </MainContainer>
    )
  }
}

MainScreen.propTypes = {
  testAction: PropTypes.func,
  testActionResult: PropTypes.any,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MainScreen)
