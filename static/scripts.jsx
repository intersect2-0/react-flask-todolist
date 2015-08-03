(function () {
  var TodoBox = React.createClass({
      loadItemsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      handleItemSubmit: function(item){
        var items = this.state.data;
        var newItems = [item].concat(items);
        this.setState({data: newItems});
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: item,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      handleItemDelete: function (id){
          var items = this.state.data;
          var newdata = items.filter(function(item){
              return item.id != id;
          });
          this.setState({data: newdata});
          $.ajax({
              url: '/delete/' + id,
              type: 'DELETE',
              context: this,
              success: function() {
                this.loadItemsFromServer();
              }.bind(this),
              error: function(xhr, status, err) {
                console.error('/delete/' + id, status, err.toString());
              }.bind(this)
          });
      },
      getInitialState: function() {
          return {data: []}
      },
      componentDidMount: function() {
        this.loadItemsFromServer();
      },
      render: function() {
          return (
                  <div className = "todoBox">
                          <h1>Todo</h1>
                          <TodoList  onItemDelete={this.handleItemDelete} data={this.state.data}/>
                          <TodoForm onItemSubmit={this.handleItemSubmit}/>
                  </div>
          );
      }
  });

  var TodoForm = React.createClass({
      handleSubmit: function(e) {
          e.preventDefault();
          var text = React.findDOMNode(this.refs.text).value.trim();
          if (!text) return;
          this.props.onItemSubmit({text: text});
          React.findDOMNode(this.refs.text).value = '';
          return;
      },
      render: function(){
          return (
                  <form className="todoForm" onSubmit={this.handleSubmit}>
                      <input type="text" placeholder="What's up?"  ref="text"/>
                      <input type="submit" value="Post" />
                  </form>
          );
      }
  });

  var TodoList = React.createClass({
      handleDelete: function(id){
          this.props.onItemDelete(id);
      },
      render: function() {
          var itemNodes = this.props.data.map(function (item) {
              return (
                      <TodoItem onItemdelete={this.handleDelete} itemdata={item} key={item.id}>
                      </TodoItem>
              );
          }, this);
          return (
                  <div className="todoList">
                  {itemNodes}
                  </div>
          );
      }
  });

  var TodoItem = React.createClass({
      getInitialState: function() {
          return {
            isChecked: this.props.itemdata.done
          };
      },
      handleDoneChange: function(event){
          //console.log(event.target.value);
          $.get('/toggle', {id: this.props.itemdata.id});
          this.setState({isChecked: !this.state.isChecked});
      },
      handleClick: function(event){
          this.props.onItemdelete(this.props.itemdata.id);
      },
      render: function() {
          return (
                  <div className="todoItem" data-todoid={this.props.itemdata.id}>
                      <h1 className="itemText">
                        <input type="checkbox" checked={this.state.isChecked} onChange={this.handleDoneChange} />
                          {this.props.itemdata.text}
                          </h1>
                          {this.props.itemdata.date}
                      <button onClick={this.handleClick}>x</button>
                  </div>
          );
      }
  });
  React.render(
          <TodoBox url="/todolist" />,
          document.getElementById('content')
  );

})();