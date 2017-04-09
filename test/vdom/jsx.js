import h from '#/h';

class Post {
  render () {
    return (<div></div>);
  }
}

class List {
  render () {
    return <ul></ul>;
  }
}

const list = [];
const isTrue = true;

const t = (
  <Post className="test">
    
  </Post>
);
const r = isTrue ? <div className="ttt">1</div> : <div className="rrr">2</div>;
console.log(t);