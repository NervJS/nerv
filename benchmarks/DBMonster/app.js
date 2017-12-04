const { createElement, Component, render } = require('nervjs')

class Query extends Component {
  shouldComponentUpdate({ query, elapsed }) {
    return query !== this.props.query || elapsed !== this.props.elapsed
  }

  render() {
    const { query, elapsed, formatElapsed, elapsedClassName } = this.props
    return (
      <td class={'Query ' + elapsedClassName}>
        {formatElapsed || ' '}
        <div class="popover left">
          <div class="popover-content">{query}</div>
          <div class="arrow" />
        </div>
      </td>
    )
  }
}

class Database extends Component {
  shouldComponentUpdate({ lastMutationId }) {
    return lastMutationId !== this.props.lastMutationId
  }

  renderQuery(query) {
    return (
      <Query
        query={query.query}
        elapsed={query.elapsed}
        formatElapsed={query.formatElapsed}
        elapsedClassName={query.elapsedClassName}
      />
    )
  }

  render() {
    const { lastSample, dbname } = this.props
    return (
      <tr>
        <td class="dbname">{dbname}</td>
        <td class="query-count">
          <span class={lastSample.countClassName}>{lastSample.nbQueries}</span>
        </td>
        {lastSample.topFiveQueries.map(this.renderQuery)}
      </tr>
    )
  }
}

class DBMon extends Component {
  state = {
    databases: []
  }

  loadSamples() {
    this.setState({
      databases: ENV.generateData(true).toArray()
    })
    Monitoring.renderRate.ping()
    setTimeout(::this.loadSamples, ENV.timeout)
  }

  componentDidMount() {
    this.loadSamples()
  }

  renderDatabase(database) {
    return (
      <Database
        lastMutationId={database.lastMutationId}
        dbname={database.dbname}
        samples={database.samples}
        lastSample={database.lastSample}
      />
    )
  }

  render() {
    const { databases } = this.state
    return (
      <div>
        <table class="table table-striped latest-data">
          <tbody>{databases.map(this.renderDatabase)}</tbody>
        </table>
      </div>
    )
  }
}

render(<DBMon />, document.getElementById('dbmon'))
