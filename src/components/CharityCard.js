import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';

class CharityCard extends Component {
	render() {
		return (
			<Card className="charity-card">
				<CardMedia className="charity-card-media" title={this.props.title} image={this.props.image}>
				</CardMedia>
				<CardContent>
					<h2>{this.props.title}</h2>
					<p>{this.props.description}</p>
				</CardContent>
				<CardActions>
		          <Button size="small" color="primary" onClick={this.props.onLearnMore}>Learn More</Button>
		          <Button size="small" color="primary" onClick={this.props.onDonate}>Donate</Button>
				</CardActions>
			</Card>
		)
	}
}

CharityCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	image: PropTypes.string,
	onDonate: PropTypes.func,
	onLearnMore:PropTypes.func,
}

CharityCard.defaultProps = {
	// TODO @Gabe get some default images for here
}

export default CharityCard;