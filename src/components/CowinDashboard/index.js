// Write your code here
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

class CowinDashboard extends Component {
  state = {
    dataByAge: [],
    dataByGender: [],
    dataByCoverage: [],
    loading: true,
    gotData: null,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      this.setState({gotData: true})
      const data = await response.json()
      console.log(data)
      const formatedDataByCoverage = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      this.setState({
        dataByCoverage: formatedDataByCoverage,
      })

      const formatedDataByAge = data.vaccination_by_age.map(e => ({
        age: e.age,
        count: e.count,
      }))
      this.setState({dataByAge: formatedDataByAge})

      const formatedDataByGender = data.vaccination_by_gender.map(c => ({
        count: c.count,
        gender: c.gender,
      }))
      this.setState({dataByGender: formatedDataByGender})
      this.setState({loading: false})
    }
    if (response.status === 401) {
      this.setState({gotData: false})
      this.setState({loading: false})
    }
  }

  dataGraphs = () => {
    const {dataByAge, dataByCoverage, dataByGender} = this.state

    return (
      <div>
        <VaccinationCoverage dataByCoverage={dataByCoverage} />
        <VaccinationByGender dataByGender={dataByGender} />
        <VaccinationByAge dataByAge={dataByAge} />
      </div>
    )
  }

  failedView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  decide = () => {
    const {gotData} = this.state

    return <div>{gotData ? this.dataGraphs() : this.failedView()}</div>
  }

  render() {
    const {loading, gotData} = this.state

    return (
      <div className="dark">
        <div className="container">
          <div className="heading-logo">
            <img
              className="logo"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            />
            <h1>Co-Win</h1>
          </div>
          <h1 className="title">CoWIN Vaccination in India</h1>
          {loading ? (
            <div>
              <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
            </div>
          ) : (
            this.decide()
          )}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
