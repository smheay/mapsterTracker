import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

  


/* this file has two components
  functional react com
  lack of state and lifecycle methods

  accepts props returns jsx
  some place in seperate file
*/
const Exercise = (props) => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>
      {/* make button */}
      <Link to={"/edit/" + props.exercise._id}>edit</Link> | {/* <button */}
      
      <Button  variant="primary"
        onClick=
        {() => {
          props.deleteExercise(props.exercise._id);
        }}
        > delete{" "}
      </Button>
    </td>
  </tr>
);

/* class */

export default class EditExercises extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);
    this.state = { exercises: [] };
  }

  componentDidMount() {
    axios
      .get("/exercises/")
      .then((response) => {
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.log("Request failed", error);
      });
  }

  deleteExercise(id) {
    axios
      .delete("/exercises/" + id)
      .then((res) => console.log(res.data));
    this.setState({
      exercises: this.state.exercises.filter((el) => el._id !== id),
    }); /* updates the page when deleted */
      /* .catch(error => {
        console.log('Request failed', error);
        });  */
  }

  exerciseList() {
    return this.state.exercises.map((currentexercise) => {
      return (
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Log</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.exerciseList()}</tbody>
        </table>
      </div>
    );
  }
}
