import React, { useEffect, useState } from 'react';
import './Spacex.css';

const Spacex = () => {
    const [data, setData] = useState([]);
    const [launch, setLaunch] = useState([]);
    const [land, setLand] = useState([]);

    useEffect(() => {
        fetch('https://api.spacexdata.com/v3/launches?limit=100')
            .then(res => res.json())
            .then(data => setData(data));
    }, []);

    const launchTrueFalse = data => {
        return setLaunch(data);
    }

    // console.log(data);

    const checkLandSuccess = landStatus => {
        let status = '';
        if (landStatus === null) {
            status = 'null';
        }
        else if (landStatus === true) {
            status = 'true';
        } else {
            status = 'false';
        }
        return status;
    }

    const uniqueYear = data.map(yearBtn => yearBtn?.launch_year)

    const distinctYear = () => {
        const year = [...new Set(uniqueYear)];
        return year;
    }

    // console.log(launch);

    return (
        <section className="container">
            <h1>SpaceX Launch Programs</h1>
            <div className="main-content">
                <div className="filter">
                    <h2>Filters</h2>
                    <p className="border-bottom">Launch Year</p>
                    <div className="btn-wraper">
                        <div className="btn-grid">
                            {
                                distinctYear().map(yearBtn => <button>{yearBtn}</button>)
                            }
                        </div>
                    </div>
                    <p className="border-bottom">Successfull Launch</p>
                    <div className="btn-wraper">
                        <div className="btn-set">
                            <button onClick={() => launchTrueFalse(this.value)}>True</button>
                            <button>False</button>
                        </div>
                    </div>
                    <p className="border-bottom">Successfull Landing</p>
                    <div className="btn-wraper">
                        <div className="btn-set">
                            <button>True</button>
                            <button>False</button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {
                        data.map(launch => <div className="card">
                            <img className="img" src={launch?.links?.mission_patch_small} alt="" />
                            <h3>{launch?.mission_name} #{launch?.flight_number}</h3>
                            <h4>Mission Ids: </h4>
                            <ul className="list">
                                {launch?.mission_id.map(singleMission => <li>{singleMission}</li>)}
                            </ul>
                            <h4>Launch Year: {launch?.launch_year}</h4>
                            <h4>Launch Success: {launch?.launch_success === true ? 'true' : 'false'}</h4>
                            <h4>Land Success: {checkLandSuccess(launch?.rocket?.first_stage?.cores[0].land_success)}</h4>
                        </div>)
                    }
                </div>
            </div>
        </section>
    );
};

export default Spacex;