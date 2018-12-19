import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { deleteUser } from '../../store/actions/authActions'
import PostList from '../posts/PostList'

class User extends Component {
  handleDelete = (e) => {
    const { uid } = this.props.auth
    this.props.deleteUser(uid)
    this.props.history.push('/')
  }

  render() {
    const { profile, user, posts } = this.props
    console.log(user)

    if (user) {
      return (
        <div>
          <section className="container section" id="photos">
            <div className="row">
              <div className="col s12 m4 l4">
                { user.img ? 
                  <img src={user.img} alt="avatar" className="responsive-img" /> :
                  <img src="https://i1.wp.com/blog.dcshow.cc/wp-content/uploads/2018/01/dc-show-cover.jpg?w=945" className="responsive-img" alt="girl" />
                }
              </div>

              <div className="col s12 m6 offset-m1 l6 offset-l1">
                <h5 className="grey-text text-darken-3">{user.firstName} {user.lastName}</h5>
                <h6 className="grey-text">@{user.id}</h6>
                <div>
                  <i className="material-icons left">email</i>
                  <a href={'mailto:' + user.email}>{ user.email }</a>
                </div>

                <br />

                { user.email === profile.email ? 
                <div>
                  <Link to={'/edit/' + user.id} user={user} className="btn-small indigo z-depth-0">
                    <i className="material-icons left">create</i>
                    <span>Edit Profile</span>
                  </Link>
                  
                  <p><Link to='#' onClick={this.handleDelete} className="btn-small red z-depth-0">
                    <i className="material-icons left">delete</i>
                    <span>Delete! (Beta)</span>
                  </Link></p>
                </div>
                : null }
              </div>
            </div>
          </section>
          <PostList posts={posts} />
        </div>
      )
    } else {
      return (
        <div className="container center-align">
          <h4 className="indigo-text">Loading the user...</h4>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = state.firestore.ordered.users
  const user = users ? users[0] : null

  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    user: user,
    posts: state.firestore.ordered.posts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: (uid) => dispatch(deleteUser(uid))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    const id = props.match.params.id
    return (
      [
        { collection: 'users', where: ['id', '==', id] },
        { 
          collection: 'posts',
          // orderBy: ['createdAt', 'desc'],
          where: ['authorId', '==', id],
        }
      ]
    )
  })
)(User)
