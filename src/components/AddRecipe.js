import React, { useState } from "react"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { shuffleArray } from "../lib/utils"
import recipeData from "../assets/data/recipes.json"

// Number of foods to use when generating a recipe
const NUM_OF_FOODS = 4

const AddRecipe = ({ onAddRecipe, isLoading }) => {
  const { mealtimes, tools, foods } = recipeData
  const [checkedMeals, setCheckedMeals] = useState(
    new Array(mealtimes.length).fill(false)
  )

  const onChangeHandler = position => {
    const updatedCheckedMeals = checkedMeals.map((item, index) =>
      index === position ? !item : item
    )
    setCheckedMeals(updatedCheckedMeals)
  }

  const validateForm = () => {
    return checkedMeals.some(x => x === true)
  }

  const submitHandler = e => {
    e.preventDefault()

    const data = {
      mealtimes: mealtimes.filter((meal, index) => checkedMeals[index]),
      foods: shuffleArray(foods).slice(0, NUM_OF_FOODS),
      tools: tools,
    }

    onAddRecipe(data)
  }

  return (
    <form onSubmit={submitHandler}>
      <fieldset disabled={isLoading}>
        <div className="tile-group">
          {mealtimes.map((meal, index) => {
            return (
              <div key={index} className="tile">
                <input
                  type="checkbox"
                  onChange={() => onChangeHandler(index)}
                  checked={checkedMeals[index]}
                  id={index}
                />
                <label htmlFor={index}>
                  {checkedMeals[index] && (
                    <BsFillCheckCircleFill
                      style={{ fontSize: "30px", color: "#645cff" }}
                    />
                  )}
                  <h4>{meal}</h4>
                </label>
              </div>
            )
          })}
        </div>
        <button
          type="submit"
          className="btn"
          disabled={!validateForm() || isLoading}
        >
          Generate
        </button>
      </fieldset>
    </form>
  )
}

export default AddRecipe
