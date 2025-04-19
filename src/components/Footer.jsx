import { Link } from "react-router-dom"
import "../styles/footer.css"
import twitter from "../assets/twitter.png"
import linkedin from "../assets/linkedin.png"
import github from "../assets/github-sign.png"

export default function Footer() {
  return <footer className="credits-container">
    <p>Made by: <Link className="link-portfolio" 
          to="https://waynecruz.github.io/portfolio/"
          target="_blank"
          >
        <strong>Dev Wayne</strong>
      </Link>
    </p>

    <div className="account-link-container">
      <Link to="https://x.com/@UzumakiWayney" target="_blank">
        <img src={twitter} alt="X account"/>
      </Link>
      <Link to="https://www.linkedin.com/in/nylbert-wayne-cruz-128832339" target="_blank">
        <img src={linkedin} alt="Linkedin account"/>
      </Link>
      <Link to="https://github.com/wayneCruz" target="_blank">
        <img src={github} alt="Github account"/>
      </Link> 
    </div>
  </footer>
}