import './component_css/LoadingComponent.css'
const LoadingComponent: React.FC = () => {
    return(
        <div className="loadingwrapper">
            <div className="spinner"></div>
            <h1>Carregando...</h1>
        </div>
    );
}

export default LoadingComponent