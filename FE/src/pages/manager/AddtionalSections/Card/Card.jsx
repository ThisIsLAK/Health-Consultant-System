import React from 'react';
import './Card.css';

const Card = () => {
  const cards = [
    {
      name: 'Revenue',
      icon: 'bx bx-money',
      amount: 50000,
      percentage: 0.25,
    },
    {
      name: 'Sales',
      icon: 'bx bx-shopping-bag',
      amount: 200,
      percentage: 0.1,
    },
    {
      name: 'Total Products',
      icon: 'bx bx-box',
      amount: 150,
      percentage: -0.11,
    },
    {
      name: 'Customers',
      icon: 'bx bx-user',
      amount: 300,
      percentage: 0.4,
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div key={index} className="col-xxl-3 col-md-4">
          <div className="card info-card sales-card">
            <div className="card-body">
              <h5 className="card-title">{card.name}</h5>
              <div className="d-flex align-items-center">
                <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className={card.icon}></i>
                </div>
                <div className="ps-3">
                  <h6>
                    {card.name === 'Revenue'
                      ? '$' + card.amount.toLocaleString('en-US')
                      : card.amount.toLocaleString('en-US')}
                  </h6>
                  <span
                    className={`${
                      card.percentage > 0 ? 'text-success' : 'text-danger'
                    } small pt-1 fw-bold`}
                  >
                    {Math.abs(card.percentage * 100)}%
                  </span>
                  <span className="text-muted small pt-2 ps-1">
                    {card.percentage > 0 ? 'increase' : 'decrease'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
