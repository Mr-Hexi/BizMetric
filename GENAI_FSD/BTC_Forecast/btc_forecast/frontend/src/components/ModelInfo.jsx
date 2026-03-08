import React from 'react';

const ModelInfo = ({ info, loading }) => {
    if (loading || !info) {
        return (
            <div className="glass-card">
                <h5 className="card-title">Model Registry Info</h5>
                <div className="skeleton skeleton-box"></div>
                <div className="skeleton skeleton-box"></div>
            </div>
        );
    }

    const getStageClass = (stage) => {
        const s = (stage || '').toLowerCase();
        if (s === 'production') return 'production';
        if (s === 'staging') return 'staging';
        if (s === 'archived') return 'archived';
        return 'default';
    };

    return (
        <div className="glass-card">
            <h5 className="card-title">Model Registry Info</h5>

            <div className="info-boxes">
                <div className="info-box lstm">
                    <div>
                        <h6 className="info-label">LSTM Model</h6>
                        <div className="info-details">
                            <span className={`badge ${getStageClass(info.lstm?.stage)}`}>
                                {info.lstm?.stage || 'N/A'}
                            </span>
                            <span className="version-text">Ver: {info.lstm?.version || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="info-box gru">
                    <div>
                        <h6 className="info-label">GRU Model</h6>
                        <div className="info-details">
                            <span className={`badge ${getStageClass(info.gru?.stage)}`}>
                                {info.gru?.stage || 'N/A'}
                            </span>
                            <span className="version-text">Ver: {info.gru?.version || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelInfo;
