import React, { Component } from 'react';
import { withRouter } from 'react-router'

import TabBar from '../components/TabBar'
import NavBar from '../components/NavBar'
import DescribeGift from '../components/DescribeGift'
import ItemizeGift from '../components/ItemizeGift'
import NewGiftSummary from '../components/NewGiftSummary'
import {UserType} from '../components/User'
import {PriceForItems} from '../components/Helpers'

import {CreateNewGift} from "../backend/APIManager";


class CreateRequest extends Component {

	constructor(props) {
		super(props)
		// By default, a gift expires a year from today, UTC
		const defaultExpiration = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
		this.state = {gift:{tags:[],
							title:"",
							description:"",
							expiration: defaultExpiration,
							background: "",
							challenge: "",
							items:[]}}
	}

	render() {
		const account = this.props.account
		console.log(`Account: ${account}`)
		const handleSubmit = () => {
			const items = this.state.gift.items.map((itemObj, i) => {
				return {
					itemDescription: itemObj.name,
					quantity: itemObj.num,
					pricePerUnit: itemObj.price,
				} 
			})
			const giftJSON = {
				items,
				title: this.state.gift.description,
				ethRecipientAddr: account,
				expiry: this.state.gift.expiration,
				dollars: PriceForItems(items, true),

			}
			CreateNewGift(giftJSON, (err) => {
				if (err !== undefined) {
					alert(err)
				} else {
					this.props.history.push('/thanks')
				}
			})
		} 

		const updateGift = (newGift) => {
			let gift = this.state.gift
			gift = {
				...gift,
				...newGift
			}
			this.setState({gift})
		}

		const displayData = {
			"Basic Information" : <DescribeGift store={this.props.store} onUpdate = {updateGift} gift={this.state.gift}/>,
			"List of Goods" : <ItemizeGift store={this.props.store} onUpdate = {updateGift} gift={this.state.gift}/>,
			"Let's do it": <NewGiftSummary gift={this.state.gift}/>
		}
		return (
			<div>
				<NavBar title="New Request"/>
				<div className="page-container">
					<TabBar displayData={displayData} onSubmit = {handleSubmit}/>
				</div>
			</div>
		)
	}
}

export default withRouter(CreateRequest)

