'use client'

import { cn } from '@/lib/utils'
import React, { useState, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
)

export const useAceternitySidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useAceternitySidebar must be used within a SidebarProvider')
  }
  return context
}

export const AceternitySidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const AceternitySidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <AceternitySidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </AceternitySidebarProvider>
  )
}

export const AceternitySidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <AceternitySidebarDesktop {...props} />
      <AceternitySidebarMobile {...(props as unknown as React.ComponentProps<'div'>)} />
    </>
  )
}

export const AceternitySidebarDesktop = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useAceternitySidebar()
  return (
    <>
      <motion.div
        className={cn(
          'h-full px-4 py-4 hidden md:flex md:flex-col bg-card w-[180px] shrink-0 border-r border-border',
          className
        )}
        initial={false}
        animate={{
          width: animate ? (open ? '180px' : '60px') : '180px',
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

export const AceternitySidebarMobile = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useAceternitySidebar()
  
  // Função para lidar com o gesto de swipe
  const handleSwipeClose = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = currentX - touchStartX;
      
      // Se o usuário deslizar para a esquerda mais de 100px, feche o menu
      if (diff < -100) {
        setOpen(false);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { once: true });
  };
  
  return (
    <>
      <div
        className={cn(
          'h-16 px-4 flex flex-row md:hidden items-center justify-between bg-card w-full border-b border-border shadow-md sticky top-0 z-10'
        )}
        {...props}
      >
        <div className="flex items-center space-x-3">
          <img src="/Logo.svg" alt="M5 MAX Logo" className="h-9 w-9" />
          <div className="text-xl font-bold text-primary">M5 MAX</div>
        </div>
        <div className="flex items-center z-20">
          <button 
            className="p-2 rounded-md hover:bg-muted/80 transition-colors duration-200"
            onClick={() => setOpen(!open)}
          >
            <Menu
              className="text-foreground h-6 w-6"
            />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed h-full w-full inset-0 bg-background p-6 z-[100] flex flex-col',
                className
              )}
              onTouchStart={handleSwipeClose}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <img src="/Logo.svg" alt="M5 MAX Logo" className="h-9 w-9" />
                  <div className="text-xl font-bold text-primary">M5 MAX</div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-muted/80 transition-colors duration-200 active:scale-95"
                  onClick={() => setOpen(!open)}
                >
                  <X className="h-6 w-6 text-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
              <div className="py-2 px-3 mt-4 bg-muted/30 rounded-md text-xs text-muted-foreground text-center">
                Deslize para a esquerda para fechar
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export const AceternitySidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) => {
  const { open, animate } = useAceternitySidebar()
  return (
    <a
      href={link.href}
      className={cn(
        'flex items-center justify-start gap-3 group/sidebar py-4 px-3 rounded-md hover:bg-muted/50 transition-all duration-200 relative',
        className?.includes('text-primary') ? 'bg-primary/10 border-l-2 border-primary' : '',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex-shrink-0">
        {link.icon}
      </div>

      <motion.div
        initial={false}
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-foreground text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre",
          animate && !open ? "hidden" : "block"
        )}
      >
        {link.label}
      </motion.div>
    </a>
  )
}