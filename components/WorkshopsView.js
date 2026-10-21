import WorkshopCard from './WorkshopCard';
import useAllWorkshops from './Hooks/UseAllWorkshops';

// `include` is an institute's optional `workshops` list from config.yml: workshop file names
// (without .md) to show, in that order. Without it, every workshop in the repository is shown.
export default function WorkshopsView({ gitUser, gitRepo, instUser, instRepo, include }) {
    const { workshops } = useAllWorkshops({ gitUser, gitRepo, instUser, instRepo });

    const shownWorkshops = Array.isArray(include) && include.length > 0
        ? include
            .map((name) => workshops.find((workshop) => workshop.name === `${String(name).trim()}.md`))
            .filter(Boolean)
        : workshops;

    return (
        <div className="workshop-grid">
            {shownWorkshops.map((workshop) => (
                <WorkshopCard
                    key={workshop.name}
                    workshop={workshop}
                    gitUser={gitUser}
                    gitRepo={gitRepo}
                    instRepo={instRepo}
                    instUser={instUser}
                />
            ))}
        </div>
    );
}
