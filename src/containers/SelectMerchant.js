import React, { Component } from "react"

import {Avatar, Paper, Divider, Radio, Button} from 'material-ui'

import NavBar from "../components/NavBar"

import '../style/SelectMerchant.css'
import {kStyleElevation, kStylePaper} from '../style/styleConstants'
import {WeiToDollars} from '../style/Formatter'
import {containsObject} from '../components/Helpers'

import {ChooseMerchant} from '../ethereum/components/ChooseMerchant'
import {ChooseMerchantRequest} from '../backend/EthereumRequestManager'
import {FetchGift, FetchMerchants} from '../backend/APIHelper'
import {UpdateDatabase} from '../backend/APIManager'

class SelectMerchant extends Component {

  constructor(props) {
    super(props)
    this.state = {selectedValue : ''}
  }
  
  componentDidMount() {
    // If we got provided a charity already, we don't need to reload it
    const charityID = this.props.account
    if (charityID === undefined) {
      return
    }
    
    FetchGift(charityID, (charity, gift) => {
      FetchMerchants(gift, (merchants) => {
        UpdateDatabase(() => {
          // TODO @Gabe show thanks or whatever
          this.setState({charity, gift, merchants})
        })
      })
    })
  }

  render() {

    if (this.state.merchants === undefined || this.props.account === undefined)
      return <div/>

    const merchantInfo = this.state.merchants.reduce((finalVal, m) => {
      finalVal[m.ethMerchantAddr] = m
      return finalVal
    }, {})
    const merchants = this.state.gift.bids.map((b, i) => {
      let bid = b
      bid['info'] = merchantInfo[b.ethMerchantAddr]
      return bid
    })

    console.log(merchants)

    merchants.sort((a, b) => a.bidAmt - b.bidAmt)

    const handleChange = event => {
      this.setState({selectedValue: event.target.value})
    }
    const checked = val => {
      return this.state.selectedValue === val
    }

    const topMerchants = (merch, topCount) => {
      return merch.reduce((merchants, m) => {
        const allMerchants = [...merchants, m]
        if (allMerchants.length <= topCount) {
          return allMerchants
        }
        const minValIndex = allMerchants.reduce((finalIndex, currentVal, currentIndex, array) => {
          return array[currentIndex].bidAmt >= array[finalIndex].bidAmt ? currentIndex : finalIndex
        }, 0)
        return allMerchants.slice(0, minValIndex).concat(allMerchants.slice(minValIndex + 1))
      }, [])
    }

    const onSelect = (merchant) => () => {
      const blockchainCompletion = (error) => {
        if (error) console.log(error)
        else       alert("You've selected a merchant, maybe.")
      }
      const ethData = ChooseMerchantRequest(this.state.gift, merchant.ethMerchantAddr)
      ChooseMerchant(ethData, blockchainCompletion)
    }


    const availableMerchants = topMerchants(merchants, 3)
    const selectedMerchant = this.state.selectedValue === '' ? undefined : merchantInfo[this.state.selectedValue]

    return (
        <div>
          <NavBar title={"Select Merchant"} />
          <div className="page-container">
            <Paper elevation={kStyleElevation} style={kStylePaper}>
            <MerchantOptionHeader/>
            {
              merchants.map((m, i) => {
                return <MerchantOption  key={i}
                                        name={m.info.name}
                                        merchantAddress={m.ethMerchantAddr}
                                        offer={m.bidAmt}
                                        days={[m.info.minShipment, m.info.maxShipment]}
                                        index={i}
                                        enabled={containsObject(m, availableMerchants)}
                                        radio={{handleChange, checked}}
                        />
              })
            }
            </Paper>
            <Paper elevation={kStyleElevation} style={kStylePaper}>
             <MerchantSelected merchant = {selectedMerchant}
                               onSelect = {onSelect}
              />
            </Paper>
          </div>
        </div>
      )
  }
}


class MerchantOption extends Component {

  render() {
    const overlayClass = this.props.enabled ? "merchant-select-no-overlay" : "merchant-select-overlay"
    const avatarStyle = (index) => {
      // Generated by locking in two colors and making new schemes
      const size = 60
      const colors = [
        "#317EAC", // main blue
        "#EDAE44", // main yellow
        "#4B7F52", // green
        "#7FD8BE", // aqua
        "#074F57", // turquoise
      ]
      return {"marginRight":10,
              "height":size,
              "width":size,
              "fontSize": 24,
              "backgroundColor":colors[index%colors.length]}
    }
    return (
          <div className = "merchant-select-container">
            <div className = {overlayClass}/>
            <div className = "merchant-select-merchant-box">
              <div className = "merchant-select-avatar">
                <Avatar style={avatarStyle(this.props.index)}>{this.props.name.charAt(0)}</Avatar>
              </div>
              <div className = "merchant-select-name">{this.props.name}</div>
              <div className = "merchant-select-price">${WeiToDollars(this.props.offer)}</div>
              <div className = "merchant-select-time">{this.props.days[0]} - {this.props.days[1]} days</div>
              <div className = "merchant-select-choice">
                <Radio
                  checked={this.props.radio.checked(this.props.merchantAddress)}
                  onChange={this.props.radio.handleChange}
                  value={this.props.merchantAddress}
                  color="primary"
                  disabled={!this.props.enabled}
                  aria-label={this.props.name}/>
              </div>
            </div>

          </div>
      )
  }
}

class MerchantOptionHeader extends Component {

  render() {

    return (
        <div>
          <div className = "merchant-select-merchant-box merchant-header">
            <div className = "merchant-select-avatar merchant-header-text"/>
            <div className = "merchant-select-name merchant-header-text">Merchant<Divider/></div>
            <div className = "merchant-select-price merchant-header-text">Offer<Divider/></div>
            <div className = "merchant-select-time merchant-header-text">Shipping Time<Divider/></div>
            <div className = "merchant-select-choice merchant-header-text">Selection<Divider/></div>

          </div>
        </div>
      )
  }
}

class MerchantSelected extends Component {
  render () {
    if (this.props.merchant === undefined)
      return <div>Please select a merchant to ship your goods.</div>

    return (
      <div>
        <div className = "merchant-selected-description">
        You have selected <span className = "merchant-selected-name">{this.props.merchant.name}</span> to ship your goods. Upon confirmation, the merchant will be paid and your goods will be shipped.
        </div>
        <Button onClick = {this.props.onSelect(this.props.merchant)} variant="raised" size="medium" color="primary">Confirm</Button>
      </div>
    )
  }
}

export default SelectMerchant

