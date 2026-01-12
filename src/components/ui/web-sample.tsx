const WebSample = ({ title, description }: Record<string, string>) => {
   return (
      <section className="flex flex-col items-center mb-8">
         <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl">N</span>
         </div>
         <h1 className="text-gray-900 dark:text-white text-3xl mb-2">{title}</h1>
         <p className="text-gray-500">{description}</p>
      </section>
   )
}

export default WebSample;