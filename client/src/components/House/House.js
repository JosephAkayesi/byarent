import React, { Component } from 'react'

class House extends Component {
    constructor() {
        super()

        this.state = {
            cartItems: []
        }
    }

    render() {
        return (
            <div className='col-sm-4 d-inline-flex pb-3'>
                <div class="card" style={{ width: '20rem' }}>
                    <img class="card-img-top" src={this.props.image} style={{ objectFit: 'none', objectPosition: 'center', width: '100%', maxHeight: '250px', marginBottom: '1rem' }} alt="home" />
                    <div class="card-body" >
                        <h5 class="card-title" style={{ fontWeight: 'bold' }}>{this.props.name}</h5>
                        <h5 class="card-title" style={{ fontWeight: '400' }}><sup>&#8373;</sup> {this.props.price.toLocaleString()}</h5>
                        <p class="card-text">{this.props.description}...
                            <button type="button" style={{ padding: '0rem 0rem 0rem 0rem' }} className="btn btn-link"><small className="form-text" style={{ marginTop: '0rem', color: '#2780E3' }}>See more</small></button>
                        </p>
                        <a href="#addtocart" onClick={() => this.props.addItemToCart(this.props.id)}  className="btn" style={{ color: 'white', borderColor: '#5CC09D', backgroundColor: '#5CC09D' }}>Add to cart</a>
                    </div>
                </div>
            </div>

        )
    }
}

export default House