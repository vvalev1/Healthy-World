export default function Header(props) {
    return (
        <div className="container-fluid page-header" id="pageHedaer">
            <div className="container">
                <h1 className="display-3 mb-3 animated slideInDown">{props.pageName}</h1>
            </div>
        </div>
    );
}