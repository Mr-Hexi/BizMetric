import React from 'react';

const PredictionCard = ({ title, price, modelType, loading }) => {
    const isLstm = modelType === 'lstm';
    const isGru = modelType === 'gru';
    const isCurrent = modelType === 'current';

    const formatPrice = (p) => {
        if (!p) return '...';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);
    };

    return (
        <div className="glass-card">
            <div className="pred-card-body">
                <div>
                    <h3 className="pred-title">
                        {title}
                    </h3>
                    {loading ? (
                        <div className="skeleton skeleton-text"></div>
                    ) : (
                        <div className={`pred-price ${isLstm ? 'lstm' : isGru ? 'gru' : ''}`} style={isCurrent ? { color: '#fff' } : {}}>
                            {formatPrice(price)}
                        </div>
                    )}
                </div>
                <div className="pred-footer">
                    {isCurrent ? (
                        <>
                            <span className="dot" style={{ backgroundColor: '#fff' }}></span>
                            Latest fetched market price
                        </>
                    ) : (
                        <>
                            <span className={`dot ${isLstm ? 'lstm' : 'gru'}`}></span>
                            Predicting next 1 hour
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;
