import React from "react"
import { Link } from "gatsby"

const Footer = () => {
  return (
    <footer className="page-footer">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <Link to="/">
          <span>AI Food Recipes</span>
        </Link>
        . Built with <a href="https://www.gatsbyjs.com/">Gatsby</a>
      </p>
    </footer>
  )
}

export default Footer
