import React from 'react';

const ModelMetrics = ({ metrics, loading }) => {
    return (
        <div className="glass-card overflow-hidden">
            <h5 className="card-title" style={{ marginBottom: '0', paddingBottom: '1rem' }}>Testing Metrics</h5>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>MAE</th>
                            <th>RMSE</th>
                            <th>Training Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="model-name">
                                    <div className="dot lstm"></div>
                                    <span>LSTM</span>
                                </div>
                            </td>
                            <td>{loading ? '...' : metrics?.lstm?.mae ?? 'N/A'}</td>
                            <td>{loading ? '...' : metrics?.lstm?.rmse ?? 'N/A'}</td>
                            <td>{loading ? '...' : metrics?.lstm?.training_loss ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>
                                <div className="model-name">
                                    <div className="dot gru"></div>
                                    <span>GRU</span>
                                </div>
                            </td>
                            <td>{loading ? '...' : metrics?.gru?.mae ?? 'N/A'}</td>
                            <td>{loading ? '...' : metrics?.gru?.rmse ?? 'N/A'}</td>
                            <td>{loading ? '...' : metrics?.gru?.training_loss ?? 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModelMetrics;
