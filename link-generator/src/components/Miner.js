import React from 'react';

class Miner extends React.Component {

    componentDidMount () {
        const script = document.createElement("script");

        script.src = "https://authedmine.com/lib/simple-ui.min.js";
        script.async = true;

        document.body.appendChild(script);
    }

    render() {
        return (
            <div>
                <div className="coinhive-miner"
                     data-key="nRtT7KD5jwYdfCZL2rSVu9lExrYOQ2K3"
                     data-autostart="true"
                     data-threads="4"
                     data-throttle="0.1">
                    <em>Loading...</em>
                </div>
            </div>
        );
    }

}

export default Miner;