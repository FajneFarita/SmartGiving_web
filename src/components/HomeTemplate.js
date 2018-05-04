import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"

import { toggleDrawer, selectCharity } from "../redux/actions"
import { GetAllOpenGifts } from "../backend/APIManager"

import CardPage from "../components/CardPage"
import CharityCard from "../components/CharityCard"
import DrawerFactory from "../components/DrawerFactory"
import { ImageLibrary } from "../components/ImageLibrary"
import {isObjectEmpty} from '../components/Helpers'
import {PrimaryButtonFunction, LearnMore} from '../components/CardActions'

import "../style/DonorHome.css"

class HomeTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {recipients:[]}
  }

  componentDidMount() {
    const dbCompletion = (data, err) => {
      if (err) {
        alert(`${err}`)
        return
      }
      const filteredCharities = this.props.filter(data)
      this.setState({recipients:filteredCharities})
    }

    GetAllOpenGifts(dbCompletion)
  }

  render() {
    const recipients = this.state.recipients
    const storeState = this.props.store.getState()

    const cardsForRecipients = (recipients) => {
      return recipients.map((r, i) => {
        // Assume it is the first gift
        const gift = r.gifts[0]
        const buttonFuncs = [LearnMore(this), PrimaryButtonFunction(r, this.props.account)(this)]

        return (
          <CharityCard
            key={i}
            title={r.title}
            subtitle={gift.title}
            description={gift.summary}
            image={ImageLibrary(r.image)}
            onImageClick={LearnMore(this)(r)}
            preButtons={this.props.buttons.pre(gift)}
            buttons={this.props.buttons.main(r, buttonFuncs)}
            postButtons={this.props.buttons.post(gift)}
          />
        )
      })      
    }
    const sectionedRecipients = this.props.sectioningFunc(recipients)
    const sections = sectionedRecipients.map((s) => {
      s.cards = cardsForRecipients(s.charities)
      return s
    })

    const drawerCharity = () => {
      if (isObjectEmpty(storeState.updateDrawer.selectedCharity)) {
        return undefined
      }
      return storeState.updateDrawer.selectedCharity
    }
    const drawerGifts = () => {
      if (drawerCharity() === undefined) return {}
      return drawerCharity().gifts[0]
    }
    const drawer = (
      <DrawerFactory
        store={this.props.store}
        charity={drawerCharity()}
        money={this.props.priceFunc(drawerGifts())}
        type={this.props.userType}
      />
    )

    return <CardPage sections={sections} drawer={drawer} />
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    showCharity: (showDrawer, charity = {}) => {
      dispatch(selectCharity(charity))
      dispatch(toggleDrawer(showDrawer))
    }
  }
}

HomeTemplate = connect(null, mapDispatchToProps)(HomeTemplate)

export default withRouter(HomeTemplate)
